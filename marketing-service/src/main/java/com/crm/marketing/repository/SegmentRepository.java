package com.crm.marketing.repository;

import com.crm.marketing.entity.Segment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SegmentRepository extends JpaRepository<Segment, Long> {

    List<Segment> findByCompanyId(String companyId);
}
