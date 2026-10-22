package cl.duoc.pedidos360_bff;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final RabbitTemplate rabbitTemplate;

    public PedidoController(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> obtenerPedidosDummy() {
        return List.of(
            Map.of("id", 1, "producto", "Laptop HP", "estado", "En tránsito"),
            Map.of("id", 2, "producto", "Monitor LG 27", "estado", "Entregado"),
            Map.of("id", 3, "producto", "Teclado Mecánico", "estado", "Procesando")
        );
    }

    @PostMapping
    public ResponseEntity<String> crearPedido(@RequestBody Object pedido) {
        // Enviar mensaje a RabbitMQ
        rabbitTemplate.convertAndSend("pedidos360.exchange", "pedido.registro", pedido);
        return ResponseEntity.ok("Pedido recibido y encolado exitosamente");
    }
}