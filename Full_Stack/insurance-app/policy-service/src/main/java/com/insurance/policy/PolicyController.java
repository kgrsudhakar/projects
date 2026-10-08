package com.insurance.policy;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/policies")
public class PolicyController {
    private final PolicyRepository repo;
    public PolicyController(PolicyRepository repo) { this.repo = repo; }
    @GetMapping public List<Policy> all() { return repo.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Policy> one(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public Policy create(@Valid @RequestBody Policy p) { p.setId(null); return repo.save(p); }
    @PutMapping("/{id}") public ResponseEntity<Policy> update(@PathVariable Long id, @Valid @RequestBody Policy p) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        p.setId(id); return ResponseEntity.ok(repo.save(p));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id); return ResponseEntity.noContent().build();
    }
}
