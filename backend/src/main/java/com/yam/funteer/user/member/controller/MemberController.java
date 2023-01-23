package com.yam.funteer.user.member.controller;

import com.yam.funteer.user.member.dto.MemberProfileResponse;
import com.yam.funteer.user.member.dto.SelectMemberRequest;
import com.yam.funteer.user.member.service.MemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.yam.funteer.user.member.dto.CreateMemberRequest;

import java.util.List;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor @Slf4j
@Api(value = "일반회원 API", tags ={"Member"})
public class MemberController {

	private final MemberService memberService;

	@PostMapping
	@ApiOperation(value = "회원 가입", notes = "<strong>이메일, 패스워드, 이름, 닉네임, 전화번호</strong>은 필수입력 값이다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "잘못된 요청 값"),
			@ApiResponse(code = 409, message = "중복된 이메일"),
			@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<String> signupMember(@Validated @RequestBody CreateMemberRequest createMemberRequest, BindingResult bindingResult){
		if(bindingResult.hasErrors()){
			List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			fieldErrors.forEach(fieldError -> log.info(fieldError.getDefaultMessage()));
			return ResponseEntity.badRequest().body("잘못된 입력입니다.");
		}

		memberService.signupMember(createMemberRequest);
		return ResponseEntity.ok("회원가입이 완료되었습니다.");
	}

	@DeleteMapping
	@ApiOperation(value = "회원 탈퇴", notes = "<strong>비밀번호</strong>를 이용하여 검증한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 400, message = "잘못된 요청 값"),
			@ApiResponse(code = 500, message = "서버 에러")
	})
	public ResponseEntity<String> signoutMember(@Validated @RequestBody SelectMemberRequest selectMemberRequest, BindingResult bindingResult){
		if(bindingResult.hasErrors()){
			List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			fieldErrors.forEach(fieldError -> log.info(fieldError.getDefaultMessage()));
			return ResponseEntity.badRequest().body("잘못된 입력입니다.");
		}

		log.info("회원탈퇴 시작");
		memberService.signoutUMember(selectMemberRequest);
		return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
	}

	@GetMapping("/account")
	public ResponseEntity getMemberInfo(@Validated @RequestBody SelectMemberRequest selectMemberRequest, BindingResult bindingResult){
		if(bindingResult.hasErrors()){
			List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			fieldErrors.forEach(fieldError -> log.info(fieldError.getDefaultMessage()));
			return ResponseEntity.badRequest().body("잘못된 입력입니다.");
		}

		log.info("회원정보 조회 시작");

		return null;
	}

	@PutMapping("/account")
	public ResponseEntity modifyAccount(@Validated @RequestBody SelectMemberRequest selectMemberRequest, BindingResult bindingResult){
		if(bindingResult.hasErrors()){
			List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			fieldErrors.forEach(fieldError -> log.info(fieldError.getDefaultMessage()));
			return ResponseEntity.badRequest().build();
		}

		return null;
	}

	@GetMapping("/profile")
	public ResponseEntity<MemberProfileResponse> getMemberProfile(@Validated @RequestBody SelectMemberRequest selectMemberRequest, BindingResult bindingResult){
		if(bindingResult.hasErrors()){
			List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			fieldErrors.forEach(fieldError -> log.info(fieldError.getDefaultMessage()));
			return ResponseEntity.badRequest().build();
		}

		log.info("회원 프로필 조회 시작");
		MemberProfileResponse memberProfile = memberService.getMemberProfile(selectMemberRequest);
		return ResponseEntity.ok(memberProfile);
	}

	@PutMapping("/profile")
	public ResponseEntity modifyProfile(){
		return null;
	}

}
