package com.sample.util;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpUtil {

    private static final Logger log = LoggerFactory.getLogger(HttpUtil.class);
    private static final OkHttpClient okHttpClient = new OkHttpClient.Builder().connectTimeout(10, TimeUnit.SECONDS).build();

    public static ObjectNode doGet(String url) {
        Request request = new Request.Builder().url(url).build();
        try (Response execute = okHttpClient.newCall(request).execute();) {
            if (execute.isSuccessful()) {
                String body = Objects.requireNonNull(execute.body()).string();
                return ObjectNodeUtil.stringToJson(body);
            } else {
                log.info("request fail, code is {}", execute.code());
            }
        } catch (IOException e) {
            log.error("request error, url: {}", url);
        }
        return null;
    }
}
