package dev.com.quiz.repository;

import dev.com.quiz.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizDb extends JpaRepository<Question,Integer> {

}
