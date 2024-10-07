-- Edit button in View Galleries:
UPDATE Galleries
SET Name = ‘Vancouver Art Gallery’, Type = ‘Art Gallery’, Address = ‘750 Hornby St’
WHERE ID# = 1000;

-- Delete button in View Galleries:
DELETE FROM Galleries WHERE ID# = 1000;

-- Join: A user can select artworks or exhibits or artists to see what artworks are contained in which exhibits and made by which artists.
SELECT e.exhibit_id, e.title, a.art_id, a.title, m.artist_id, m.name
FROM Exhibit e, Art a, Artist m
WHERE e.exhibit_id = a.exhibit_id AND a.artist_id = m.artist_id AND (e.exhibit_id = _user_input__ OR a.artist_id = _user_input__ OR a.art_id = _user_input__) ;

-- Aggregation w/ Group By: A user can select a gallery to see how many artworks are in it.
-- Result should be a table grouped by gallery, displaying galleryID, gallery name, and the number of artworks 
SELECT g.gallery_id, g.name, Count(a.art_id) AS num_artworks
FROM Art a, Exhibit e, Gallery g
WHERE a.exhibit_id = e.exhibit_id AND e.gallery_id = g.gallery_id AND (e.gallery_id = _user_input__ OR e.gallery_id = _user_input__ … )
GROUP BY e.gallery_id;

-- Aggregation w/ Having: A user can view the number of customers in exhibits with a minimum number of customers set by the user. 
-- Result should be a table grouped by exhibit, displaying exhibitID, exhibit title, and the number of customers 
SELECT v.exhibit_id, title, Count(customer_id) AS num_customers
FROM Visits v, Exhibit e
WHERE v.exhibit_id = e.exhibit_id
GROUP BY v.exhibit_id
HAVING Count(*) > __user_input__ ;

-- Nested Aggregation: Age of Artists with Oldest Artwork:
-- Find the average birth year of artists who have made artworks older than the average age of all artworks in a gallery.
-- Result should display average birth_year -->
SELECT AVG(birth_year) AS avg_birth_year
FROM Artist m
WHERE m.artist_id IN (SELECT DISTINCT m1.artist_id
                      FROM Art a, Artist m1, Exhibit e, Gallery g
                      WHERE a.artist_id = m1.artist_id AND a.exhibit_id = e.exhibit_id AND e.gallery_id = g.gallery_id AND 
               			  a.year_created < (SELECT AVG(a2.year_created) 
         			                          FROM Art a2, Exhibit e2, Gallery g2 
          			                        WHERE a2.exhibit_id = e2.exhibit_id AND e2.gallery_id = g2.gallery_id AND g2.gallery_id = __user_input__));

-- Division: A user can select a gallery and see which customers have visited every exhibit in that gallery.
-- Result should be a table displaying customerID and customer name -->
SELECT c.customer_id, c.name
FROM Customer c
WHERE NOT EXISTS ((SELECT exhibit_id
			        FROM Exhibit 
                    WHERE gallery_id = _user_input_ )
                    EXCEPT
                  	(SELECT exhibit_id
                    FROM Visits v
		            WHERE v.customer_id = c.customer_id));
