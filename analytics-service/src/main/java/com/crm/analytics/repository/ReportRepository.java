package com.crm.analytics.repository;

import com.crm.analytics.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByType(String type);

    List<Report> findByCreatedBy(Long userId);
}
