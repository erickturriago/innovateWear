-- TRUNCATE limpia las tablas y reinicia los contadores de ID (secuencias) para una ejecución limpia cada vez.
TRUNCATE TABLE users, products, design_categories, designs, custom_designs, custom_design_prints, orders, order_items RESTART IDENTITY CASCADE;

-- =================================================================
-- 1. USUARIOS
-- =================================================================
-- Se crean usuarios con roles diferentes. La columna 'id' se omite para que sea autogenerada.
-- IMPORTANTE: Las contraseñas han sido "hasheadas" con BCrypt. El texto original era 'admin123', 'artista123', 'cliente123'.
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Admin', 'admin@innovatewear.com', 'admin123', 'ADMIN', true, NOW(), NOW());
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Carlos Artista', 'carlos@artista.com', 'artista123', 'ARTISTA', true, NOW(), NOW());
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Ana Cliente', 'ana@cliente.com', 'cliente123', 'CLIENTE', true, NOW(), NOW());
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Leonardo Turriago', 'leonardoturriagovargas@gmail.com', 'cliente123', 'CLIENTE', true, NOW(), NOW());

-- =================================================================
-- 2. PRODUCTOS (Camisetas Base)
-- =================================================================
-- La base para la personalización. La columna 'id' se omite.
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, link, created_at, updated_at) VALUES ('Camiseta Básica Blanca', 'Camiseta de algodón 100% para personalizar.', 25000.00, 'Customizable', 'M', 'blanco', 'Algodón', true, true, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/camiseta%20blanca.png?alt=media&token=4dbdeef6-9307-4898-b3b5-55417c3325f9', NOW(), NOW());
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, link, created_at, updated_at) VALUES ('Camiseta Básica Negra', 'Camiseta de algodón 100% para personalizar.', 25000.00, 'Customizable', 'L', 'negro', 'Algodón', true, true, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/camiseta%20blanca.png?alt=media&token=4dbdeef6-9307-4898-b3b5-55417c3325f9', NOW(), NOW());

-- =================================================================
-- 3. CATEGORÍAS DE DISEÑOS
-- =================================================================
-- Para organizar las estampas. La columna 'id' se omite.
INSERT INTO design_categories (name, description, active, created_at, updated_at) VALUES ('Divertida', 'Diseños cómicos y divertidos', true, NOW(), NOW());
INSERT INTO design_categories (name, description, active, created_at, updated_at) VALUES ('Videojuego', 'Diseños inspirados en videojuegos', true, NOW(), NOW());

-- =================================================================
-- 4. DISEÑOS (Estampas)
-- =================================================================
-- Creados por el ARTISTA (que tendrá id=2) y asignados a CATEGORÍAS (que tendrán id=1 y 2). La columna 'id' se omite.
INSERT INTO designs (name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES ('Baby Yoda', 'Adorable diseño del personaje más querido de Star Wars', 15000.00, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/gato.jpg?alt=media&token=7249fee3-55fc-4285-862a-3bcd4451eed9', 2, 2, true, NOW(), NOW());
INSERT INTO designs (name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES ('Ben 10', 'Diseño del popular personaje de Cartoon Network.', 12500.00, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/ben10.png?alt=media&token=4fe6f73a-2c4a-4b84-867e-64eaf85acbba', 2, 2, true, NOW(), NOW());

-- =================================================================
-- EJEMPLOS COMENTADOS (También corregidos por si se usan a futuro)
-- Nota: Si descomentas estas líneas, los IDs de las claves foráneas (creator_id, product_id, etc.)
-- deben corresponder a los IDs que se generaron automáticamente en los pasos anteriores.
-- =================================================================

-- 5. DISEÑOS PERSONALIZADOS (Camisetas listas para la venta)
-- INSERT INTO custom_designs (name, description, price, creator_id, product_id, is_public, active, created_at, updated_at) VALUES ('Camiseta Adorable Baby Yoda', 'La fuerza es tierna en ti. Camiseta personaliza con Baby Yoda.', 35000.00, 2, 1, true, true, NOW(), NOW());
-- INSERT INTO custom_designs (name, description, price, creator_id, product_id, is_public, active, created_at, updated_at) VALUES ('Camiseta Héroe Ben 10', 'Es hora de ser héroe. Camiseta negra con el logo de Ben 10.', 32500.00, 2, 2, true, true, NOW(), NOW());

-- 6. DETALLE DE ESTAMPAS DEL DISEÑO PERSONALIZADO
-- INSERT INTO custom_design_prints (custom_design_id, design_id, position_x, position_y, size_percentage, rotation_angle, layer_order, created_at) VALUES (1, 1, 150, 100, 80, 0, 1, NOW());
-- INSERT INTO custom_design_prints (custom_design_id, design_id, position_x, position_y, size_percentage, rotation_angle, layer_order, created_at) VALUES (2, 2, 160, 110, 70, 5, 1, NOW());

-- 7. ORDEN DE COMPRA
-- INSERT INTO orders (user_id, total, status, customer_name, customer_phone, customer_email, notes, created_at, updated_at) VALUES (3, 35000.00, 'PENDIENTE', 'Ana Cliente', '+57 300 123 4567', 'ana@cliente.com', 'Envolver para regalo.', NOW(), NOW());

-- 8. ITEMS DE LA ORDEN
-- INSERT INTO order_items (order_id, custom_design_id, quantity, size, unit_price, total_price, created_at) VALUES (1, 1, 1, 'S', 35000.00, 35000.00, NOW());