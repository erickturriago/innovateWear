-- PRODUCTOS
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, created_at, updated_at) VALUES ('Camiseta Básica M Blanca', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'M', 'blanco', '100% algodón', true, true, NOW(), NOW());
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, created_at, updated_at) VALUES ('Camiseta Básica M Negra', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'M', 'negro', '100% algodón', true, true, NOW(), NOW());
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, created_at, updated_at) VALUES ('Camiseta Básica L Blanca', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'L', 'blanco', '100% algodón', true, true, NOW(), NOW());

-- USUARIOS
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Admin Usuario', 'admin@innovatewear.com', 'admin123', 'ADMIN', true, NOW(), NOW());
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Carlos Artista', 'carlos@artista.com', 'artista123', 'ARTISTA', true, NOW(), NOW());
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES ('Ana Cliente', 'ana@cliente.com', 'cliente123', 'CLIENTE', true, NOW(), NOW());

-- CATEGORÍAS
INSERT INTO design_categories (name, description, active, created_at, updated_at) VALUES ('Divertida', 'Diseños cómicos y divertidos', true, NOW(), NOW());
INSERT INTO design_categories (name, description, active, created_at, updated_at) VALUES ('Videojuego', 'Diseños inspirados en videojuegos', true, NOW(), NOW());

-- DISEÑOS (Carlos Artista = ID 2)
INSERT INTO designs (name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES ('Baby Yoda', 'Adorable diseño del personaje más querido de Star Wars', 15.00, 'https://example.com/baby-yoda.jpg', 2, 2, true, NOW(), NOW());
INSERT INTO designs (name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES ('Gato Serio', 'Gato con expresión seria y divertida', 12.50, 'https://example.com/gato-serio.jpg', 1, 2, true, NOW(), NOW());

-- PEDIDOS (Ana Cliente = ID 3)
INSERT INTO orders (user_id, total, status, customer_name, customer_phone, customer_email, notes, created_at, updated_at) VALUES (3, 47.98, 'PENDIENTE', 'Ana Cliente', '+57 300 123 4567', 'ana@cliente.com', 'Entrega urgente por favor', NOW(), NOW());

-- ITEMS DE PEDIDOS
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES (1, 1, 2, 19.99, 39.98, NOW());

-- DISEÑOS EN LOS ITEMS
INSERT INTO order_item_designs (order_item_id, design_id, position_x, position_y, size_percentage, created_at) VALUES (1, 1, 50, 30, 80, NOW());