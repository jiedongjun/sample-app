package com.sample.web.rest;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sample.domain.Sample;
import com.sample.domain.SampleFile;
import com.sample.repository.SampleFileRepository;
import com.sample.repository.SampleRepository;
import com.sample.service.SampleService;
import com.sample.util.ObjectNodeUtil;
import com.sample.web.rest.errors.BadRequestAlertException;
import com.sample.web.rest.vm.ResultVM;
import com.sample.web.rest.vm.SampleVM;
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
 * REST controller for managing {@link com.sample.domain.Sample}.
 */
@RestController
@RequestMapping("/api")
public class SampleResource {

    private final Logger log = LoggerFactory.getLogger(SampleResource.class);

    private static final String ENTITY_NAME = "sample";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SampleService sampleService;

    private final SampleRepository sampleRepository;

    private final SampleFileRepository sampleFileRepository;

    public SampleResource(SampleService sampleService, SampleRepository sampleRepository, SampleFileRepository sampleFileRepository) {
        this.sampleService = sampleService;
        this.sampleRepository = sampleRepository;
        this.sampleFileRepository = sampleFileRepository;
    }

    /**
     * {@code POST  /samples} : Create a new sample.
     *
     * @param sample the sample to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sample, or with status {@code 400 (Bad Request)} if the sample has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/samples")
    public ResponseEntity<Sample> createSample(@RequestBody Sample sample) throws URISyntaxException {
        log.debug("REST request to save Sample : {}", sample);
        if (sample.getId() != null) {
            throw new BadRequestAlertException("A new sample cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sample result = sampleService.save(sample);
        return ResponseEntity
            .created(new URI("/api/samples/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @ApiOperation(value = "添加作品集接口", tags = "作品集模块", httpMethod = "POST", notes = "如果是修改，请求参数中带上id即可")
    @PostMapping("/samples/v1")
    public ResultVM createSample(@RequestBody ObjectNode sampleNode) {
        ResultVM resultVM = new ResultVM(0, "创建成功");
        Sample sample = new Sample();
        sample.setDuration(sampleNode.get("duration").asInt());
        sample.setName(sampleNode.get("name").asText());
        sample.setUserId(sampleNode.get("userId").asLong());
        if (sampleNode.has("id")) {
            sample.setId(sampleNode.get("id").asLong());
        }
        try {
            sample = sampleService.save(sample);
            ObjectNode sampleObj = ObjectNodeUtil.convertValue(sample, ObjectNode.class);

            List<SampleFile> sampleFiles = sampleFileRepository.findBySampleId(sample.getId());
            sampleFiles.forEach(
                sampleFile -> {
                    sampleFileRepository.deleteById(sampleFile.getId());
                }
            );

            ArrayNode list = sampleNode.withArray("imgsList");
            Sample finalSample = sample;
            ArrayNode files = ObjectNodeUtil.createArrayNode();

            list.forEach(
                sampleFile -> {
                    String url = sampleFile.get("url").asText();
                    SampleFile newSampleFile = new SampleFile(url, finalSample.getId());
                    if (sampleFile.has("id") && sampleFile.get("id").asLong() != 0) {
                        newSampleFile.setId(sampleFile.get("id").asLong());
                    }
                    SampleFile save = sampleFileRepository.save(newSampleFile);
                    files.add(ObjectNodeUtil.convertValue(save, ObjectNode.class));
                }
            );
            sampleObj.set("files", files);
            resultVM.setData(sampleObj);
        } catch (Exception e) {
            resultVM.setCode(-1);
            resultVM.setMessage("添加成功");
        }
        return resultVM;
    }

    /**
     * {@code PUT  /samples/:id} : Updates an existing sample.
     *
     * @param id the id of the sample to save.
     * @param sample the sample to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sample,
     * or with status {@code 400 (Bad Request)} if the sample is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sample couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/samples/{id}")
    public ResponseEntity<Sample> updateSample(@PathVariable(value = "id", required = false) final Long id, @RequestBody Sample sample)
        throws URISyntaxException {
        log.debug("REST request to update Sample : {}, {}", id, sample);
        if (sample.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sample.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sample result = sampleService.save(sample);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sample.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /samples/:id} : Partial updates given fields of an existing sample, field will ignore if it is null
     *
     * @param id the id of the sample to save.
     * @param sample the sample to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sample,
     * or with status {@code 400 (Bad Request)} if the sample is not valid,
     * or with status {@code 404 (Not Found)} if the sample is not found,
     * or with status {@code 500 (Internal Server Error)} if the sample couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/samples/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Sample> partialUpdateSample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Sample sample
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sample partially : {}, {}", id, sample);
        if (sample.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sample.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sample> result = sampleService.partialUpdate(sample);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sample.getId().toString())
        );
    }

    /**
     * {@code GET  /samples} : get all the samples.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of samples in body.
     */
    @GetMapping("/samples")
    public ResponseEntity<List<Sample>> getAllSamples(Pageable pageable) {
        log.debug("REST request to get a page of Samples");
        Page<Sample> page = sampleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /samples/:id} : get the "id" sample.
     *
     * @param id the id of the sample to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sample, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/samples/{id}")
    public ResponseEntity<Sample> getSample(@PathVariable Long id) {
        log.debug("REST request to get Sample : {}", id);
        Optional<Sample> sample = sampleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sample);
    }

    /**
     * {@code DELETE  /samples/:id} : delete the "id" sample.
     *
     * @param id the id of the sample to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @ApiOperation(value = "删除作品集以及该作品集的所有文件接口", tags = "作品集模块", httpMethod = "DELETE", notes = "")
    @DeleteMapping("/samples/{id}")
    public ResultVM deleteSample(@PathVariable Long id) {
        ResultVM resultVM = new ResultVM(0, "删除成功");
        log.debug("REST request to delete Sample : {}", id);
        sampleService.delete(id);
        List<SampleFile> sampleFileList = sampleFileRepository.findBySampleIdOrderByCreatedDateAsc(id);
        sampleFileList.forEach(sampleFile -> sampleFileRepository.deleteById(sampleFile.getId()));
        Optional<Sample> one = sampleService.findOne(id);
        if (one.isPresent()) {
            resultVM.setCode(-1);
            resultVM.setMessage("删除失败");
        }
        return resultVM;
    }

    @ApiOperation(value = "查询用户下所有作品集列表接口", tags = "作品集模块", httpMethod = "GET", notes = "")
    @GetMapping("/samples/user/{userId}")
    public List<SampleVM> getUserSamples(@PathVariable long userId) {
        return sampleService.getUserSample(userId);
    }
}
