package com.sample.web.rest.vm;

import com.sample.domain.Sample;

public class SampleVM extends Sample {

    private String homePage;

    public String getHomePage() {
        return homePage;
    }

    public void setHomePage(String homePage) {
        this.homePage = homePage;
    }
}
