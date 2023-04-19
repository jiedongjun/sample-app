package com.sample.service;

import com.sample.domain.SampleFile;
import com.sample.repository.SampleFileRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SampleFile}.
 */
@Service
@Transactional
public class SampleFileService {

    private final Logger log = LoggerFactory.getLogger(SampleFileService.class);

    private final SampleFileRepository sampleFileRepository;

    public SampleFileService(SampleFileRepository sampleFileRepository) {
        this.sampleFileRepository = sampleFileRepository;
    }

    /**
     * Save a sampleFile.
     *
     * @param sampleFile the entity to save.
     * @return the persisted entity.
     */
    public SampleFile save(SampleFile sampleFile) {
        log.debug("Request to save SampleFile : {}", sampleFile);
        return sampleFileRepository.save(sampleFile);
    }

    /**
     * Partially update a sampleFile.
     *
     * @param sampleFile the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SampleFile> partialUpdate(SampleFile sampleFile) {
        log.debug("Request to partially update SampleFile : {}", sampleFile);

        return sampleFileRepository
            .findById(sampleFile.getId())
            .map(
                existingSampleFile -> {
                    if (sampleFile.getUrl() != null) {
                        existingSampleFile.setUrl(sampleFile.getUrl());
                    }
                    if (sampleFile.getSampleId() != null) {
                        existingSampleFile.setSampleId(sampleFile.getSampleId());
                    }

                    return existingSampleFile;
                }
            )
            .map(sampleFileRepository::save);
    }

    /**
     * Get all the sampleFiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<SampleFile> findAll(Pageable pageable) {
        log.debug("Request to get all SampleFiles");
        return sampleFileRepository.findAll(pageable);
    }

    /**
     * Get one sampleFile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SampleFile> findOne(Long id) {
        log.debug("Request to get SampleFile : {}", id);
        return sampleFileRepository.findById(id);
    }

    /**
     * Delete the sampleFile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete SampleFile : {}", id);
        sampleFileRepository.deleteById(id);
    }

    public List<SampleFile> findBySampleId(long sampleId) {
        try {
            return sampleFileRepository.findBySampleId(sampleId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
