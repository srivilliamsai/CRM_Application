package com.crm.analytics.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.analytics.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByType(String type);

    List<Report> findByCompanyId(String companyId);

    List<Report> findByCreatedBy(Long userId);
}
