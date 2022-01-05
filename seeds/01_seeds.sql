INSERT INTO users (name, email, password) VALUES ('abc', 'abc@abc.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('xyz', 'xyz@abc.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('c', 'abc@ayx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES (1, 'beach House', 'nice place', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
250, 1, 3, 4, 'India', 'Main street', 'Chd', 'UT', 160017, TRUE),
 (3, 'No House', 'Somewhat nice place', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
250, 1, 3, 4, 'India', 'street', 'pb', 'Punjab', 140017, TRUE),
(2, 'Tree House', ' Also nice place', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
250, 1, 2, 3, 'India', 'Main 1street', 'Delhi', 'NCR', 110017, TRUE);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');


INSERT INTO property_reviews (guest_id, property_id,reservation_id,rating,message
) VALUES (3, 2, 1, 5, 'messages'),
(2, 1, 3, 3, 'messages'),
(1, 3, 2, 4, 'messages');