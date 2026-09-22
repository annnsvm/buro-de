-- End-to-end tests wipe and rewrite whatever database they point at, so they get one
-- of their own. Keeping it separate from buero_dev means a test run cannot destroy the
-- courses and accounts you are working with by hand.
CREATE DATABASE buero_test OWNER buero;
