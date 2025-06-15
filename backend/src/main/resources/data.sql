-- TRUNCATE limpia las tablas y reinicia los contadores de ID para una ejecución limpia cada vez.
TRUNCATE TABLE users, products, design_categories, designs, custom_designs, custom_design_prints, orders, order_items RESTART IDENTITY CASCADE;

-- =================================================================
-- 1. USUARIOS
-- =================================================================
-- Se crean 3 usuarios con roles diferentes: ADMIN, ARTISTA y CLIENTE.
INSERT INTO users (id, name, email, password, role, active, created_at, updated_at) VALUES (1, 'Admin', 'admin@innovatewear.com', 'admin123', 'ADMIN', true, NOW(), NOW());
INSERT INTO users (id, name, email, password, role, active, created_at, updated_at) VALUES (2, 'Carlos Artista', 'carlos@artista.com', 'artista123', 'ARTISTA', true, NOW(), NOW());
INSERT INTO users (id, name, email, password, role, active, created_at, updated_at) VALUES (3, 'Ana Cliente', 'ana@cliente.com', 'cliente123', 'CLIENTE', true, NOW(), NOW());

-- =================================================================
-- 2. PRODUCTOS (Camisetas Base)
-- =================================================================
-- La base para la personalización. Nota que el precio aquí es solo referencial de la camiseta base.
INSERT INTO products (id, name, description, price, type, size, color, material, customizable, active, link, created_at, updated_at) VALUES (1, 'Camiseta Básica Blanca', 'Camiseta de algodón 100% para personalizar.', 15.00, 'Customizable', 'M', 'blanco', 'Algodón', true, true, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/camiseta%20blanca.png?alt=media&token=4dbdeef6-9307-4898-b3b5-55417c3325f9', NOW(), NOW());
INSERT INTO products (id, name, description, price, type, size, color, material, customizable, active, link, created_at, updated_at) VALUES (2, 'Camiseta Básica Negra', 'Camiseta de algodón 100% para personalizar.', 15.00, 'Customizable', 'L', 'negro', 'Algodón', true, true, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/camiseta-negra.png?alt=media&token=e9e68593-9c86-455a-9097-427c3a0b5a51', NOW(), NOW());

-- =================================================================
-- 3. CATEGORÍAS DE DISEÑOS
-- =================================================================
-- Para organizar las estampas.
INSERT INTO design_categories (id, name, description, active, created_at, updated_at) VALUES (1, 'Divertida', 'Diseños cómicos y divertidos', true, NOW(), NOW());
INSERT INTO design_categories (id, name, description, active, created_at, updated_at) VALUES (2, 'Videojuego', 'Diseños inspirados en videojuegos', true, NOW(), NOW());

-- =================================================================
-- 4. DISEÑOS (Estampas con tus links originales)
-- =================================================================
-- Creados por el ARTISTA con id=2.
INSERT INTO designs (id, name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES (1, 'Baby Yoda', 'Adorable diseño del personaje más querido de Star Wars', 15.00, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/gato.jpg?alt=media&token=7249fee3-55fc-4285-862a-3bcd4451eed9', 2, 2, true, NOW(), NOW());
INSERT INTO designs (id, name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES (2, 'Ben 10', 'Diseño del popular personaje de Cartoon Network.', 12.50, 'https://firebasestorage.googleapis.com/v0/b/soundrentals-ef63b.appspot.com/o/ben10.png?alt=media&token=4fe6f73a-2c4a-4b84-867e-64eaf85acbba', 2, 2, true, NOW(), NOW());

-- =================================================================
-- 5. DISEÑOS PERSONALIZADOS (Camisetas listas para la venta)
-- =================================================================
-- Una camiseta personalizada creada por el ARTISTA para que esté a la venta.
--INSERT INTO custom_designs (id, name, description, price, creator_id, product_id, is_public, active, created_at, updated_at) VALUES (1, 'Camiseta Adorable Baby Yoda', 'La fuerza es tierna en ti. Camiseta personaliza con Baby Yoda.', 29.99, 2, 1, true, true, NOW(), NOW());
--INSERT INTO custom_designs (id, name, description, price, creator_id, product_id, is_public, active, created_at, updated_at) VALUES (2, 'Camiseta Héroe Ben 10', 'Es hora de ser héroe. Camiseta negra con el logo de Ben 10.', 27.50, 2, 2, true, true, NOW(), NOW());


-- =================================================================
-- 6. DETALLE DE ESTAMPAS DEL DISEÑO PERSONALIZADO
-- =================================================================
-- Se especifica qué estampa va en qué diseño personalizado.
--INSERT INTO custom_design_prints (custom_design_id, design_id, position_x, position_y, size_percentage, rotation_angle, layer_order, created_at) VALUES (1, 1, 150, 100, 80, 0, 1, NOW());
--INSERT INTO custom_design_prints (custom_design_id, design_id, position_x, position_y, size_percentage, rotation_angle, layer_order, created_at) VALUES (2, 2, 160, 110, 70, 5, 1, NOW());

-- =================================================================
-- 7. ORDEN DE COMPRA
-- =================================================================
-- Una orden de ejemplo para la CLIENTE con id=3.
--INSERT INTO orders (id, user_id, total, status, customer_name, customer_phone, customer_email, notes, created_at, updated_at) VALUES (1, 3, 29.99, 'PENDIENTE', 'Ana Cliente', '+57 300 123 4567', 'ana@cliente.com', 'Envolver para regalo.', NOW(), NOW());

-- =================================================================
-- 8. ITEMS DE LA ORDEN
-- =================================================================
-- El detalle de lo que la CLIENTE Ana está comprando. Usa "custom_design_id".
--INSERT INTO order_items (order_id, custom_design_id, quantity, size, unit_price, total_price, created_at) VALUES (1, 1, 1, 'S', 29.99, 29.99, NOW());