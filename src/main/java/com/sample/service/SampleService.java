package com.sample.service;

import com.sample.domain.Sample;
import com.sample.domain.SampleFile;
import com.sample.repository.SampleFileRepository;
import com.sample.repository.SampleRepository;
import com.sample.web.rest.vm.SampleVM;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sample}.
 */
@Service
@Transactional
public class SampleService {

    private final Logger log = LoggerFactory.getLogger(SampleService.class);

    private final SampleRepository sampleRepository;
    private final SampleFileRepository sampleFileRepository;

    public SampleService(SampleRepository sampleRepository, SampleFileRepository sampleFileRepository) {
        this.sampleRepository = sampleRepository;
        this.sampleFileRepository = sampleFileRepository;
    }

    /**
     * Save a sample.
     *
     * @param sample the entity to save.
     * @return the persisted entity.
     */
    public Sample save(Sample sample) {
        log.debug("Request to save Sample : {}", sample);

        return sampleRepository.save(sample);
    }

    /**
     * Partially update a sample.
     *
     * @param sample the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Sample> partialUpdate(Sample sample) {
        log.debug("Request to partially update Sample : {}", sample);

        return sampleRepository
            .findById(sample.getId())
            .map(
                existingSample -> {
                    if (sample.getName() != null) {
                        existingSample.setName(sample.getName());
                    }
                    if (sample.getDuration() != null) {
                        existingSample.setDuration(sample.getDuration());
                    }
                    if (sample.getUserId() != null) {
                        existingSample.setUserId(sample.getUserId());
                    }

                    return existingSample;
                }
            )
            .map(sampleRepository::save);
    }

    /**
     * Get all the samples.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Sample> findAll(Pageable pageable) {
        log.debug("Request to get all Samples");
        return sampleRepository.findAll(pageable);
    }

    /**
     * Get one sample by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Sample> findOne(Long id) {
        log.debug("Request to get Sample : {}", id);
        return sampleRepository.findById(id);
    }

    /**
     * Delete the sample by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Sample : {}", id);
        sampleRepository.deleteById(id);
    }

    public List<SampleVM> getUserSample(long userId) {
        List<SampleVM> sampleVMList = new ArrayList<>();
        List<Sample> sampleList = sampleRepository.findByUserId(userId);
        sampleList.forEach(
            sample -> {
                SampleVM sampleVM = sample.toSampleVM();
                List<SampleFile> sampleFileList = sampleFileRepository.findBySampleIdOrderByCreatedDateAsc(sample.getId());
                if (sampleFileList.size() > 0) {
                    sampleVM.setHomePage(sampleFileList.get(0).getUrl());
                }
                sampleVMList.add(sampleVM);
            }
        );
        return sampleVMList;
    }
}
