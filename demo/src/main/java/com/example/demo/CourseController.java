package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000") 
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

 
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (!optionalCourse.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Course course = optionalCourse.get();
        course.setCourseName(updatedCourse.getCourseName());
        course.setCourseId(updatedCourse.getCourseId());
        course.setAddress(updatedCourse.getAddress());
        course.setRate(updatedCourse.getRate());
        course.setQty(updatedCourse.getQty());
//        course.setAmount(updatedCourse.getAmount());
      
        courseRepository.save(course);

        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
