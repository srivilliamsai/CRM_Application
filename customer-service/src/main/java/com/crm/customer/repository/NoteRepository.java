package com.crm.customer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.customer.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
