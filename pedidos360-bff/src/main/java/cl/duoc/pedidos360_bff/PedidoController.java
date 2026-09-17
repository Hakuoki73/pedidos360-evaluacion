package cl.duoc.pedidos360_bff;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200") // Reforzamos el CORS aquí también
public class PedidoController {

    @GetMapping
    public List<Map<String, Object>> obtenerPedidosDummy() {
        return List.of(
            Map.of("id", 1, "producto", "Laptop HP", "estado", "En tránsito"),
            Map.of("id", 2, "producto", "Monitor LG 27", "estado", "Entregado"),
            Map.of("id", 3, "producto", "Teclado Mecánico", "estado", "Procesando")
        );
    }
}