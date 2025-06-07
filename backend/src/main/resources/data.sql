-- Datos iniciales para camisetas personalizables
INSERT INTO products (name, description, price, type, size, color, material, customizable, active, created_at, updated_at) VALUES
-- CAMISETAS MANGA CORTA
('Camiseta Básica M Blanca', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'M', 'blanco', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Básica M Negra', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'M', 'negro', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Básica L Blanca', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'L', 'blanco', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Básica L Negra', 'Camiseta básica personalizable de manga corta', 19.99, 'manga_corta', 'L', 'negro', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Premium M Azul', 'Camiseta premium personalizable de manga corta', 24.99, 'manga_corta', 'M', 'azul', '100% algodón peinado', true, true, NOW(), NOW()),
('Camiseta Premium L Roja', 'Camiseta premium personalizable de manga corta', 24.99, 'manga_corta', 'L', 'rojo', '100% algodón peinado', true, true, NOW(), NOW()),

-- CAMISETAS MANGA LARGA
('Camiseta Manga Larga M Blanca', 'Camiseta personalizable de manga larga', 24.99, 'manga_larga', 'M', 'blanco', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Manga Larga L Negra', 'Camiseta personalizable de manga larga', 24.99, 'manga_larga', 'L', 'negro', '100% algodón', true, true, NOW(), NOW()),
('Camiseta Manga Larga M Gris', 'Camiseta personalizable de manga larga', 24.99, 'manga_larga', 'M', 'gris', '100% algodón', true, true, NOW(), NOW()),

-- POLOS
('Polo Clásico M Blanco', 'Polo personalizable con cuello', 29.99, 'polo', 'M', 'blanco', '100% algodón piqué', true, true, NOW(), NOW()),
('Polo Clásico L Azul Marino', 'Polo personalizable con cuello', 29.99, 'polo', 'L', 'azul_marino', '100% algodón piqué', true, true, NOW(), NOW()),
('Polo Deportivo M Negro', 'Polo deportivo personalizable', 32.99, 'polo', 'M', 'negro', 'poliéster técnico', true, true, NOW(), NOW()),

-- TANK TOPS
('Tank Top M Blanco', 'Camiseta sin mangas personalizable', 16.99, 'tank_top', 'M', 'blanco', '100% algodón', true, true, NOW(), NOW()),
('Tank Top L Negro', 'Camiseta sin mangas personalizable', 16.99, 'tank_top', 'L', 'negro', '100% algodón', true, true, NOW(), NOW()),
('Tank Top Deportivo M Gris', 'Tank top deportivo personalizable', 19.99, 'tank_top', 'M', 'gris', 'poliéster transpirable', true, true, NOW(), NOW());

-- USUARIOS DE PRUEBA
INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES
-- ADMIN
('Admin Usuario', 'admin@innovatewear.com', 'admin123', 'ADMIN', true, NOW(), NOW()),

-- ARTISTAS
('Carlos Artista', 'carlos@artista.com', 'artista123', 'ARTISTA', true, NOW(), NOW()),
('María Designer', 'maria@designer.com', 'designer123', 'ARTISTA', true, NOW(), NOW()),
('Juan Creative', 'juan@creative.com', 'creative123', 'ARTISTA', true, NOW(), NOW()),

-- CLIENTES
('Ana Cliente', 'ana@cliente.com', 'cliente123', 'CLIENTE', true, NOW(), NOW()),
('Pedro Comprador', 'pedro@comprador.com', 'comprador123', 'CLIENTE', true, NOW(), NOW()),
('Sofia Usuario', 'sofia@usuario.com', 'usuario123', 'CLIENTE', true, NOW(), NOW());

-- CATEGORÍAS DE DISEÑOS
INSERT INTO design_categories (name, description, active, created_at, updated_at) VALUES
('Divertida', 'Diseños cómicos y divertidos', true, NOW(), NOW()),
('Videojuego', 'Diseños inspirados en videojuegos', true, NOW(), NOW()),
('Película', 'Diseños de películas y series', true, NOW(), NOW()),
('Amor', 'Diseños románticos y de amor', true, NOW(), NOW()),
('Héroes', 'Diseños de superhéroes y héroes', true, NOW(), NOW()),
('Vintage', 'Diseños retro y vintage', true, NOW(), NOW()),
('Animales', 'Diseños con animales', true, NOW(), NOW()),
('Deportes', 'Diseños deportivos', true, NOW(), NOW());

-- DISEÑOS
INSERT INTO designs (name, description, price, image_url, category_id, artist_id, active, created_at, updated_at) VALUES
-- Diseños de Carlos Artista (ID: 2)
('Baby Yoda', 'Adorable diseño del personaje más querido de Star Wars', 15.00, 'https://example.com/baby-yoda.jpg', 2, 2, true, NOW(), NOW()),
('Gato Serio', 'Gato con expresión seria y divertida', 12.50, 'https://example.com/gato-serio.jpg', 1, 2, true, NOW(), NOW()),

-- Diseños de María Designer (ID: 3)
('Eva 01', 'Diseño del icónico robot de Evangelion', 18.00, 'https://example.com/eva-01.jpg', 2, 3, true, NOW(), NOW()),
('Corazón Vintage', 'Diseño romántico con estilo retro', 14.00, 'https://example.com/corazon-vintage.jpg', 4, 3, true, NOW(), NOW()),

-- Diseños de Juan Creative (ID: 4)
('León Majestuoso', 'Diseño artístico de un león', 16.50, 'https://example.com/leon.jpg', 7, 4, true, NOW(), NOW()),
('Capitán América', 'Escudo del primer vengador', 17.00, 'https://example.com/capitan-america.jpg', 5, 4, true, NOW(), NOW()),
('Sonrisa Emoji', 'Clásico emoji sonriente', 10.00, 'https://example.com/sonrisa.jpg', 1, 4, true, NOW(), NOW()),
('Balón de Fútbol', 'Diseño deportivo de fútbol', 13.00, 'https://example.com/futbol.jpg', 8, 4, true, NOW(), NOW());