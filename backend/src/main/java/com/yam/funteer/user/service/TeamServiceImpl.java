package com.yam.funteer.user.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.yam.funteer.attach.entity.Attach;
import com.yam.funteer.attach.entity.TeamAttach;
import com.yam.funteer.attach.repository.AttachRepository;
import com.yam.funteer.attach.repository.TeamAttachRepository;
import com.yam.funteer.common.aws.AwsS3Uploader;
import com.yam.funteer.exception.EmailDuplicateException;
import com.yam.funteer.user.dto.request.CreateAccountRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yam.funteer.exception.UserNotFoundException;
import com.yam.funteer.funding.entity.Funding;
import com.yam.funteer.user.dto.request.BaseUserRequest;
import com.yam.funteer.user.dto.request.CreateTeamRequest;
import com.yam.funteer.user.dto.response.TeamProfileResponse;
import com.yam.funteer.user.entity.Team;
import com.yam.funteer.user.repository.FollowRepository;
import com.yam.funteer.user.repository.TeamRepository;

@Service @Slf4j
@Transactional
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService{

	// private final FundingRepository fundingRepository;
	private final FollowRepository followRepository;
	private final TeamRepository teamRepository;
	private final PasswordEncoder passwordEncoder;
	private final AttachRepository attachRepository;
	private final TeamAttachRepository teamAttachRepository;
	private final AwsS3Uploader awsS3Uploader;

	@Override
	public void createAccountWithOutProfile(CreateTeamRequest request) {
		Optional<Team> findTeam = teamRepository.findByEmail(request.getEmail());
		findTeam.ifPresent(team -> {
			throw new EmailDuplicateException();
		});

		request.encryptPassword(passwordEncoder);

		Team team = request.toTeam();
		teamRepository.save(team);


		request.validateFile();
		MultipartFile vmsFile = request.getVmsFile();
		MultipartFile performFile = request.getPerformFile();

		// 저장
		try {
			String vmsFilePath = awsS3Uploader.upload(vmsFile, "teamFile");
			String performFilePath = awsS3Uploader.upload(performFile, "teamFile");

			List<Attach> attachList = request.getAttachList(vmsFilePath, performFilePath);
			for(Attach attach : attachList){
				attachRepository.save(attach);
				TeamAttach teamAttach = TeamAttach.of(team, attach);
				teamAttachRepository.save(teamAttach);
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public void setAccountSignOut(BaseUserRequest baseUserRequest) {
		Optional<Team> findTeam = teamRepository.findById(baseUserRequest.getUserId());
		Team team = findTeam.orElseThrow(UserNotFoundException::new);
		String password = baseUserRequest.getPassword().orElseThrow(IllegalArgumentException::new);

		team.validatePassword(passwordEncoder, password);
		team.signOut();
	}


	@Override
	public TeamProfileResponse getTeamProfile(BaseUserRequest baseUserRequest) {
		Optional<Team> findTeam = teamRepository.findById(baseUserRequest.getUserId());
		Team team = findTeam.orElseThrow(UserNotFoundException::new);
		List<Funding> fundingList = new ArrayList<>(); // fundingRepository.findAllByTeamId(team.getId());
		long followerCnt = followRepository.countAllByTeam(team);

		return TeamProfileResponse.of(team, fundingList, followerCnt);
	}


}
