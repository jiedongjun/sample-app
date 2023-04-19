package com.sample.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sample.util.HttpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WeixinService {

    private final Logger log = LoggerFactory.getLogger(WeixinService.class);
    private final String APPID = "wxdd7309f61fe609cc";
    private final String SECRET = "f18ec53e1aaad9c8a2705d74547c447b";

    /**
     *
     * @param code 登录时获取的 code，可通过wx.login获取
     * @return {
     *              "openid":"xxxxxx",
     *              "session_key":"xxxxx",
     *              "unionid":"xxxxx",
     *              "errcode":0,
     *              "errmsg":"xxxxx"
     *          }
     */
    public ObjectNode getLoginInfo(String code) {
        String LOGIN_INFO_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
        String url = String.format(LOGIN_INFO_URL, APPID, SECRET, code);
        return HttpUtil.doGet(url);
    }

    public static void main(String[] args) {
        String LOGIN_INFO_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
        String url = String.format(
            LOGIN_INFO_URL,
            "wxdd7309f61fe609cc",
            "f18ec53e1aaad9c8a2705d74547c447b",
            "013845Ga1edP1F08UIIa1n5Syh1845Gw"
        );
        ObjectNode objectNode = HttpUtil.doGet(url);
        System.out.print(objectNode);
    }
}
