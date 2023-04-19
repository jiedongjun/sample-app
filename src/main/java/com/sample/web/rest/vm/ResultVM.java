package com.sample.web.rest.vm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ResultVM {

    /**
     * http 请求结果状态码
     */
    private int code; // code 为 0 表示接口正常

    /**
     * 信息提示
     */
    private String message;

    /**
     * 数据
     */
    private JsonNode data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public JsonNode getData() {
        return data;
    }

    public void setData(JsonNode data) {
        this.data = data;
    }

    public ResultVM() {}

    public ResultVM(int code, String message, ObjectNode data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ResultVM(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
