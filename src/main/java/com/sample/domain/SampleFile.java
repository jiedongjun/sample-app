package com.sample.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SampleFile.
 */
@Entity
@Table(name = "sample_file")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SampleFile extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "url")
    private String url;

    @Column(name = "sample_id")
    private Long sampleId;

    @Column(name = "stop_time")
    private Integer stopTime;

    public SampleFile() {}

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SampleFile id(Long id) {
        this.id = id;
        return this;
    }

    public String getUrl() {
        return this.url;
    }

    public SampleFile url(String url) {
        this.url = url;
        return this;
    }

    public SampleFile(String url, Long sampleId) {
        this.url = url;
        this.sampleId = sampleId;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Long getSampleId() {
        return this.sampleId;
    }

    public SampleFile sampleId(Long sampleId) {
        this.sampleId = sampleId;
        return this;
    }

    public void setSampleId(Long sampleId) {
        this.sampleId = sampleId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SampleFile)) {
            return false;
        }
        return id != null && id.equals(((SampleFile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SampleFile{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            ", sampleId=" + getSampleId() +
            "}";
    }

    public Integer getStopTime() {
        return stopTime;
    }

    public void setStopTime(Integer stopTime) {
        this.stopTime = stopTime;
    }

    public SampleFile(String url, Long sampleId, Integer stopTime) {
        this.url = url;
        this.sampleId = sampleId;
        this.stopTime = stopTime;
    }
}
