package com.sample.domain;

import com.sample.web.rest.vm.SampleVM;
import java.io.Serializable;
import java.util.List;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sample.
 */
@Entity
@Table(name = "sample")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Sample extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "stop_time")
    private Integer stopTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sample id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Sample name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Sample duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Long getUserId() {
        return this.userId;
    }

    public Sample userId(Long userId) {
        this.userId = userId;
        return this;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sample)) {
            return false;
        }
        return id != null && id.equals(((Sample) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sample{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", duration=" + getDuration() +
            ", userId=" + getUserId() +
            "}";
    }

    public SampleVM toSampleVM() {
        SampleVM sampleVM = new SampleVM();
        sampleVM.setId(this.getId());
        sampleVM.setDuration(this.getDuration());
        sampleVM.setName(this.getName());
        sampleVM.setUserId(this.getUserId());
        sampleVM.setCreatedBy(this.getCreatedBy());
        sampleVM.setCreatedDate(this.getCreatedDate());
        sampleVM.setLastModifiedBy(this.getLastModifiedBy());
        sampleVM.setLastModifiedDate(this.getLastModifiedDate());

        return sampleVM;
    }

    public Integer getStopTime() {
        return stopTime == null ? duration : stopTime;
    }

    public void setStopTime(Integer stopTime) {
        this.stopTime = stopTime;
    }
}
