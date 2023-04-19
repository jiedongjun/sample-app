package com.sample.repository;

import com.sample.domain.SampleFile;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SampleFile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SampleFileRepository extends JpaRepository<SampleFile, Long> {
    List<SampleFile> findBySampleId(long sampleId);

    void deleteBySampleId(long sampleId);

    List<SampleFile> findBySampleIdOrderByCreatedDateAsc(long sampleId);
}
