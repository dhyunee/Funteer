package com.yam.funteer.qna.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaReplyReq {
	private Long userId;
	private String content;
}
