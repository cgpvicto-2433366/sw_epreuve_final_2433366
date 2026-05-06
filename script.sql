DROP TABLE IF EXISTS prets;
DROP TABLE IF EXISTS livres;
DROP TABLE IF EXISTS bibliotheques;


/**
 * Table bibliotheque
 * decrit les attributs qui definissent une bibliothêque
 * dans notre système
 * @source: https://www.geeksforgeeks.org/postgresql/postgresql-create-auto-increment-column-using-serial/
 * pour le serial qui fait le job du auto_increment de mysql
 * */
CREATE TABLE bibliotheques(
	id SERIAL PRIMARY KEY ,
	nom VARCHAR(100) NOT NULL,
	courriel VARCHAR(255) NOT NULL UNIQUE,
	-- 36 au lieu de 30, car une clé UUID() est de 36 caractères
	-- source: https://blogger.allthingsdev.co/fr/blog/securing-api-endpoints-with-uuids-and-best-practices
	cle_api VARCHAR(36) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);


/**
 *  Table livre
 *  elle decrit comment un livre est definis dans  notre système.
 * */
CREATE TABLE livres(
	id SERIAL PRIMARY KEY ,
	-- source: https://www.postgresql.org/docs/current/tutorial-fk.html
	bibliotheque_id INT REFERENCES bibliotheques(id),
	titre VARCHAR(100) NOT NULL,
	auteur VARCHAR(100) NOT NULL,
	isbn VARCHAR(20) NOT NULL UNIQUE,
	date_ajout DATE default CURRENT_DATE,
	disponible BOOLEAN default true,
	description TEXT -- champ ajouté
);


/**
 *  Table prets
 *  elle decrit comment un prêt est definis dans  notre système.
 * */
CREATE TABLE prets(
	id SERIAL PRIMARY KEY ,
	-- source: https://www.postgresql.org/docs/current/tutorial-fk.html
	livre_id INT REFERENCES livres(id),
	emprunteur VARCHAR(100) NOT NULL,
	date_debut DATE DEFAULT CURRENT_DATE, -- champ ajouté
	date_retour DATE
);


-- verifier la creation des tables dans la bd
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;


-- DONNÉES INITIALES

-- bibliothèques
-- mot de passe: Qwerty1234. Hasher avec: https://bcrypt-generator.com/
-- cle_api generer par claude IA
INSERT INTO bibliotheques (nom, courriel, cle_api, password) VALUES
('Bibliothèque de Victoriaville', 'victoriaville@bibliotheque.qc.ca', '550e8400-e29b-41d4-a716-446655440000', '$2a$12$NtMazsbaCtrfjVuErqGq/ueq1eyPQ0wIIzXkyWyatrcSbhmyFAfDO'),
('Bibliothèque de Québec', 'quebec@bibliotheque.qc.ca', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', '$2a$12$NtMazsbaCtrfjVuErqGq/ueq1eyPQ0wIIzXkyWyatrcSbhmyFAfDO');

-- livres
-- Données généré par claude IA
INSERT INTO livres (bibliotheque_id, titre, auteur, isbn, disponible, description) VALUES
(1, 'Clean Code', 'Robert C. Martin', '978-0132350884', true, 'Guide de bonnes pratiques en programmation'),
(1, 'The Pragmatic Programmer', 'David Thomas', '978-0135957059', false, NULL),
(1, 'Design Patterns', 'Gang of Four', '978-0201633610', true, NULL),
(2, 'Introduction aux algorithmes', 'Thomas H. Cormen', '978-0262033848', true, 'Manuel de référence en algorithmique'),
(2, 'Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2070612758', false, NULL);

-- prêts
-- Données généré par claude IA
INSERT INTO prets (livre_id, emprunteur, date_debut, date_retour) VALUES
(2, 'Alice Tremblay', '2026-04-01', '2026-04-15'),
(5, 'Mohamed Diallo', '2026-04-10', '2026-04-24');

