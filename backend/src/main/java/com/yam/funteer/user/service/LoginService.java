package com.yam.funteer.user.service;

import com.yam.funteer.user.dto.request.LoginRequest;
import com.yam.funteer.user.dto.request.TokenRequest;
import com.yam.funteer.user.dto.response.LoginResponse;
import com.yam.funteer.user.dto.response.TokenInfo;

public interface LoginService {
    LoginResponse processLogin(LoginRequest loginRequest);

    TokenInfo regenerateToken(TokenRequest tokenRequest);
}
