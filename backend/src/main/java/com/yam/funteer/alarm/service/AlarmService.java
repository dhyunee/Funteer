package com.yam.funteer.alarm.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.yam.funteer.alarm.entity.Alarm;
import com.yam.funteer.alarm.repository.AlarmRepository;
import com.yam.funteer.common.security.SecurityUtil;
import com.yam.funteer.exception.UserNotFoundException;
import com.yam.funteer.user.entity.User;
import com.yam.funteer.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmService {

	private final UserRepository userRepository;
	private final AlarmRepository alarmRepository;
	private static final Long DEFAULT_TIMEOUT=60L*1000*60;

	public SseEmitter subscribe( String lastEventId) {

		User user = userRepository.findById(SecurityUtil.getCurrentUserId()).orElseThrow(()->new UserNotFoundException());
		String email=user.getEmail();
		String emitterId = makeTimeIncludeId(email);

		SseEmitter emitter;

		if (alarmRepository.findAllEmitterStartWithByEmail(email) != null){
			alarmRepository.deleteAllEmitterStartWithId(email);
			emitter = alarmRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT)); //id가 key, SseEmitter가 value
		}
		else {
			emitter = alarmRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT)); //id가 key, SseEmitter가 value
		}

		emitter.onCompletion(() -> alarmRepository.deleteById(emitterId)); //네트워크 오류

		emitter.onTimeout(() -> {
			alarmRepository.deleteById(emitterId);
			emitter.complete();
		}); //시간 초과

		emitter.onError((e) -> alarmRepository.deleteById(emitterId)); //오류

		// 503 에러를 방지하기 위한 더미 이벤트 전송
		String eventId = makeTimeIncludeId(email);
		sendNotification(emitter, eventId, emitterId, "EventStream Created. [userId=" + email + "]");

		if (hasLostData(lastEventId)) {
			sendLostData(lastEventId, email, emitterId, emitter);
		}

		return emitter;
	}

	//단순 알림 전송
	private void sendNotification(SseEmitter emitter, String eventId, String emitterId, Object data) {

		try {
			emitter.send(SseEmitter.event()
				.id(eventId)
				.name("sse")
				.data(data, MediaType.APPLICATION_JSON));
		} catch (IOException exception) {
			alarmRepository.deleteById(emitterId);
			emitter.completeWithError(exception);
		}
	}

	private String makeTimeIncludeId(String email) { return email + "_" + System.currentTimeMillis(); }//Last-Event-ID의 값을 이용하여 유실된 데이터를 찾는데 필요한 시점을 파악하기 위한 형태

	//Last-Event-Id의 존재 여부 boolean 값
	private boolean hasLostData(String lastEventId) {
		return !lastEventId.isEmpty();
	}

	//유실된 데이터 다시 전송
	private void sendLostData(String lastEventId, String email, String emitterId, SseEmitter emitter) {

		Map<String, Object> eventCaches = alarmRepository.findAllEventCacheStartWithByEmail(email);
		eventCaches.entrySet().stream()
			.filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
			.forEach(entry -> sendNotification(emitter, entry.getKey(), emitterId, entry.getValue()));
	}

	public void send(String receiver, String content, String urlValue) {

		Alarm notification = createNotification(receiver, content, urlValue);

		// 로그인 한 유저의 SseEmitter 모두 가져오기
		Map<String, SseEmitter> sseEmitters = alarmRepository.findAllEmitterStartWithByEmail(receiver);

		sseEmitters.forEach(
			(key, emitter) -> {
				// 데이터 캐시 저장(유실된 데이터 처리하기 위함)
				alarmRepository.saveEventCache(key, notification);
				// 데이터 전송
				sendToClient(emitter, key, notification);
			}
			);
	}

	//펀딩 상태 변화 혹은 도네이션 상태 변화 시 userList 사용
	public void sendList(List receiverList, String content, String urlValue) {
		List<Alarm> notifications = new ArrayList<>();
		Map<String, SseEmitter> sseEmitters;
		for (int i = 0; i < receiverList.size(); i++) {
			int finalI = i;
			sseEmitters = new HashMap<>();
			notifications.add(createNotification(receiverList.get(i).toString(), content, urlValue));
			sseEmitters.putAll(alarmRepository.findAllEmitterStartWithByEmail(receiverList.get(i).toString()));
			sseEmitters.forEach(
				(key, emitter) -> {
					// 데이터 캐시 저장(유실된 데이터 처리하기 위함)
					alarmRepository.saveEventCache(key, notifications.get(finalI));
					// 데이터 전송
					sendToClient(emitter, key, notifications.get(finalI));
				});
		}
	}

	//알림 생성
	private Alarm createNotification(String receiver, String content, String urlValue) {
		return Alarm.builder()
			.content(content)
			.receiver(receiver)
			.url(urlValue)
			.isRead(false).build();

	}

	//알림 전송
	private void sendToClient(SseEmitter emitter, String id, Object data) {
		try {
			emitter.send(SseEmitter.event()
				.id(id)
				.name("sse")
				.data(data, MediaType.APPLICATION_JSON)
				.reconnectTime(0));

			log.info(data.toString());

			subscribe(id);

		} catch (Exception exception) {
			alarmRepository.deleteById(id);
			emitter.completeWithError(exception);
		}
	}
}