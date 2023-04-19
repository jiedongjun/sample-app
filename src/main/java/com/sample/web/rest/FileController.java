package com.sample.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sample.config.ApplicationProperties;
import io.swagger.annotations.ApiOperation;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.util.HashSet;
import java.util.Set;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
public class FileController {

    private final Logger log = LoggerFactory.getLogger(FileController.class);
    private final ApplicationProperties applicationProperties;
    private final ObjectMapper objectMapper;

    public FileController(ApplicationProperties applicationProperties, ObjectMapper objectMapper) {
        this.applicationProperties = applicationProperties;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/upload")
    @ApiOperation(value = "上传文件接口", tags = "公共接口模块", httpMethod = "POST", notes = "文件参数名name为file")
    public ObjectNode upload(@RequestParam("file") MultipartFile file) {
        ObjectNode result = objectMapper.createObjectNode();
        if (file.isEmpty()) {
            result.put("code", 1);
            result.put("msg", "上传失败，请选择文件!");
            return result;
        }

        String fileName = file.getOriginalFilename();
        String filePath = applicationProperties.getFilePath();
        Path path = Paths.get(filePath, fileName);
        File dest = new File(filePath + fileName);
        Set<PosixFilePermission> perms = new HashSet<>();
        perms.add(PosixFilePermission.OWNER_READ);
        perms.add(PosixFilePermission.OWNER_WRITE);
        perms.add(PosixFilePermission.OWNER_EXECUTE);
        perms.add(PosixFilePermission.GROUP_READ);
        perms.add(PosixFilePermission.GROUP_EXECUTE);
        perms.add(PosixFilePermission.OTHERS_READ);
        perms.add(PosixFilePermission.OTHERS_EXECUTE);
        try {
            if (!dest.getParentFile().exists()) {
                dest.getParentFile().mkdirs();
            }
            if (!dest.exists()) {
                file.transferTo(dest);
            }
            Files.setPosixFilePermissions(path, perms);
            log.debug("upload path : " + dest.getPath());
            result.put("code", 0);
            result.put("result", applicationProperties.getFileUrl() + dest.getName());
            result.put("msg", "上传成功!");
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("code", 1);
            result.put("msg", "上传失败!");
            return result;
        }
    }

    @GetMapping("/download")
    public ObjectNode downloadFile(@RequestParam String fileName, HttpServletResponse response) {
        ObjectNode result = objectMapper.createObjectNode();
        String filePath = applicationProperties.getFilePath();
        File file = new File(filePath + fileName);
        if (file.exists()) {
            response.setContentType("application/force-download");
            response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);
            byte[] buffer = new byte[1024];
            FileInputStream fis = null;
            BufferedInputStream bis = null;
            try {
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                OutputStream os = response.getOutputStream();
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
                result.put("code", 0);
                result.put("msg", "下载成功!");
                return result;
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        result.put("code", 1);
        result.put("msg", "下载失败!");
        return result;
    }
}
