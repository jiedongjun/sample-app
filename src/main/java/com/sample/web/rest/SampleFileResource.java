package com.sample.web.rest;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sample.domain.Sample;
import com.sample.domain.SampleFile;
import com.sample.repository.SampleFileRepository;
import com.sample.service.SampleFileService;
import com.sample.service.SampleService;
import com.sample.util.ObjectNodeUtil;
import com.sample.web.rest.errors.BadRequestAlertException;
import com.sample.web.rest.vm.ResultVM;
import io.swagger.annotations.ApiOperation;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sample.domain.SampleFile}.
 */
@RestController
@RequestMapping("/api")
public class SampleFileResource {

    private final Logger log = LoggerFactory.getLogger(SampleFileResource.class);

    private static final String ENTITY_NAME = "sampleFile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SampleFileService sampleFileService;
    private final SampleFileRepository sampleFileRepository;
    private final SampleService sampleService;

    public SampleFileResource(SampleFileService sampleFileService, SampleFileRepository sampleFileRepository, SampleService sampleService) {
        this.sampleFileService = sampleFileService;
        this.sampleFileRepository = sampleFileRepository;
        this.sampleService = sampleService;
    }

    /**
     * {@code POST  /sample-files} : Create a new sampleFile.
     *
     * @param sampleFile the sampleFile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sampleFile, or with status {@code 400 (Bad Request)} if the sampleFile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sample-files")
    public ResponseEntity<SampleFile> createSampleFile(@RequestBody SampleFile sampleFile) throws URISyntaxException {
        log.debug("REST request to save SampleFile : {}", sampleFile);
        if (sampleFile.getId() != null) {
            throw new BadRequestAlertException("A new sampleFile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SampleFile result = sampleFileService.save(sampleFile);
        return ResponseEntity
            .created(new URI("/api/sample-files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sample-files/:id} : Updates an existing sampleFile.
     *
     * @param id the id of the sampleFile to save.
     * @param sampleFile the sampleFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleFile,
     * or with status {@code 400 (Bad Request)} if the sampleFile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sampleFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sample-files/{id}")
    public ResponseEntity<SampleFile> updateSampleFile(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleFile sampleFile
    ) throws URISyntaxException {
        log.debug("REST request to update SampleFile : {}, {}", id, sampleFile);
        if (sampleFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SampleFile result = sampleFileService.save(sampleFile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleFile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sample-files/:id} : Partial updates given fields of an existing sampleFile, field will ignore if it is null
     *
     * @param id the id of the sampleFile to save.
     * @param sampleFile the sampleFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sampleFile,
     * or with status {@code 400 (Bad Request)} if the sampleFile is not valid,
     * or with status {@code 404 (Not Found)} if the sampleFile is not found,
     * or with status {@code 500 (Internal Server Error)} if the sampleFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sample-files/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SampleFile> partialUpdateSampleFile(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SampleFile sampleFile
    ) throws URISyntaxException {
        log.debug("REST request to partial update SampleFile partially : {}, {}", id, sampleFile);
        if (sampleFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sampleFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SampleFile> result = sampleFileService.partialUpdate(sampleFile);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sampleFile.getId().toString())
        );
    }

    /**
     * {@code GET  /sample-files} : get all the sampleFiles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sampleFiles in body.
     */
    @GetMapping("/sample-files")
    public ResponseEntity<List<SampleFile>> getAllSampleFiles(Pageable pageable) {
        log.debug("REST request to get a page of SampleFiles");
        Page<SampleFile> page = sampleFileService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sample-files/:id} : get the "id" sampleFile.
     *
     * @param id the id of the sampleFile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sampleFile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sample-files/{id}")
    public ResponseEntity<SampleFile> getSampleFile(@PathVariable Long id) {
        log.debug("REST request to get SampleFile : {}", id);
        Optional<SampleFile> sampleFile = sampleFileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sampleFile);
    }

    /**
     * {@code DELETE  /sample-files/:id} : delete the "id" sampleFile.
     *
     * @param id the id of the sampleFile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sample-files/{id}")
    public ResponseEntity<Void> deleteSampleFile(@PathVariable Long id) {
        log.debug("REST request to delete SampleFile : {}", id);
        sampleFileService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @ApiOperation(value = "作品集文件接口", tags = "作品集文件模块", httpMethod = "GET", notes = "查询作品集下的所有文件")
    @GetMapping("/sample-files/sampleId/{sampleId}")
    public ResultVM getSampleFiles(@PathVariable Long sampleId) {
        ResultVM resultVM = new ResultVM(0, "查询成功");
        Optional<Sample> one = sampleService.findOne(sampleId);
        if (one.isPresent()) {
            ObjectNode sampleNode = ObjectNodeUtil.convertValue(one.get(), ObjectNode.class);
            List<SampleFile> sampleFileList = sampleFileService.findBySampleId(sampleId);
            ArrayNode sampleArr = ObjectNodeUtil.createArrayNode();
            sampleFileList.forEach(
                sampleFile -> {
                    sampleArr.add(ObjectNodeUtil.convertValue(sampleFile, ObjectNode.class));
                }
            );
            sampleNode.set("files", sampleArr);
            resultVM.setData(sampleNode);
        } else {
            resultVM.setCode(-1);
            resultVM.setMessage("查询失败");
        }

        return resultVM;
    }
}
