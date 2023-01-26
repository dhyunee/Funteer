package com.yam.funteer.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yam.funteer.common.security.Token;
import com.yam.funteer.common.security.service.TokenService;
import com.yam.funteer.user.UserType;
import com.yam.funteer.user.dto.request.CreateMemberRequest;
import com.yam.funteer.user.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


@Component @Slf4j
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final TokenService tokenService;
    private final ObjectMapper objectMapper;
    // private final MemberService memberService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();


        String email = (String) oAuth2User.getAttributes().get("email");
        String role = UserType.KAKAO.getAuthority();
        Token token = tokenService.generateToken(email, role);
        log.info("token=> {}", token);

        writeTokenResponse(response, token);
    }

    private void writeTokenResponse(HttpServletResponse response, Token token) throws IOException {
        response.setContentType(MediaType.TEXT_XML_VALUE);

        response.addHeader("Auth", token.getAccessToken());
        response.addHeader("Refresh", token.getRefreshToken());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        PrintWriter writer = response.getWriter();
        writer.println(objectMapper.writeValueAsString(token));
        writer.flush();
    }
}
