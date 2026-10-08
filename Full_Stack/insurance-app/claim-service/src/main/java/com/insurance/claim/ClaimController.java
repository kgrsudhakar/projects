package com.insurance.claim;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimRepository repo;
    private final RestClient policyClient;
    public ClaimController(ClaimRepository repo, @Value("${policy-service.url}") String url) {
        this.repo = repo; this.policyClient = RestClient.create(url);
    }
    @GetMapping public List<Claim> all(@RequestParam(required = false) Long policyId) {
        return policyId == null ? repo.findAll() : repo.findByPolicyId(policyId);
    }
    @PostMapping public ResponseEntity<?> create(@Valid @RequestBody Claim c) {
        try { // inter-service call: policy must exist
            policyClient.get().uri("/api/policies/{id}", c.getPolicyId()).retrieve().toBodilessEntity();
        } catch (HttpClientErrorException.NotFound e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Policy " + c.getPolicyId() + " not found"));
        }
        c.setId(null); c.setStatus("SUBMITTED");
        return ResponseEntity.ok(repo.save(c));
    }
    @PatchMapping("/{id}/status") public ResponseEntity<Claim> status(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repo.findById(id).map(c -> { c.setStatus(body.get("status")); return ResponseEntity.ok(repo.save(c)); })
                .orElse(ResponseEntity.notFound().build());
    }
}
