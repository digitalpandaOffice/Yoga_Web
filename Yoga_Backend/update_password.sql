-- Update the admin password to a known hash for 'password'
UPDATE admins 
SET password = '$2y$10$YYpT2Oar.DCNfG1xNrumSOC/EW99UCv0tC3J.WmXM38fwDJ.Vm9gi2' 
WHERE username = 'admin';
