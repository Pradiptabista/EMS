stored procedure made for the table project are

//sp for get all
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_project`()
BEGIN 
SELECT 
    P_id,
    P_name,
    P_duration,
    P_budget
FROM
  project 
;
    END

    //sp for get project by user id
    CREATE DEFINER=`root`@`localhost` PROCEDURE `get_projectbyUid`(
      IN user_id int
   )
   BEGIN 
   SELECT 
   project.P_id,
       P_name,
       P_duration,
       P_budget
   FROM
     project 
   INNER JOIN mapping_userproject 
       ON project.P_id = mapping_userproject.P_id
       where user_id= mapping_userproject.user_id;
       END

       //sp for get user information through project id
       CREATE DEFINER=`root`@`localhost` PROCEDURE `get_userinfobyPid`(
        IN P_id int
     )
     BEGIN 
     SELECT 
        users.user_id,
         user_name,
         user_email, 
         user_phone, 
         user_role,
       user_dob,
         user_gender
     FROM
       users 
     INNER JOIN mapping_userproject 
         ON users.user_id = mapping_userproject.user_id
         where P_id= mapping_userproject.P_id;
         END
         
         //sp for inserting a new project
         CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_newproject`(
 
          IN P_name varchar(40),
          IN P_budget varchar(40), IN P_duration varchar(40)
         
         )
         BEGIN
         insert into project (P_name, P_budget, P_duration) Values 
          (P_name, P_budget, P_duration) 
         ;
         END
             //sp for deleting a project
             CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteproject_id`(
              in P_id int
            )
            BEGIN
            delete  project.*
            from project 
             where P_id = project.P_id;
            END

         //sp for deleting a project associated with user
         CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteproject_assignid`(
          in P_id int
        )
        BEGIN
        delete  project.*
        from project inner join
         mapping_userproject 
        on
        project.P_id= mapping_userproject.P_id
         where P_id = project.P_id;
        END
        
      //just update the project
      CREATE DEFINER=`root`@`localhost` PROCEDURE `update_project`(
        IN P_id int,
          IN P_name varchar(40), 
          IN P_budget varchar(40),
          IN P_duration varchar(40)
        )
        BEGIN
        
        UPDATE project
        SET 
          project.P_name= P_name, project.P_budget=P_budget, 
         project.P_duration= P_duration
        WHERE
        project.P_id= P_id;
        END
              
//update puid with uid
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_piduid`(
  IN P_id int,
    IN user_id int
  )
  BEGIN
  UPDATE mapping_userproject
  SET 
    mapping_userproject.P_id= P_id, 
    mapping_userproject.user_id= user_id
  
  WHERE
  mapping_userproject.P_id= P_id;
  END
 //insert into mapping table pid and uid
 CREATE DEFINER=`root`@`localhost` PROCEDURE `assign_pid2user`(
  IN P_id int,
  IN user_id int
 )
 BEGIN
 insert into mapping_userproject
 (mapping_userproject.P_id, mapping_userproject.user_id) Values 
  (P_id, user_id);
 END
 
 //image changesin databse n storedprocedure
 //get all
 CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all`()
BEGIN
SELECT user_id,user_name,user_email,user_phone, user_role, Active_user, user_dob, user_gender,image_name FROM users;
END

//get b spectific id
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_byid`(
  user_id int
)
BEGIN 
select user_id,user_name,user_email, user_phone, user_role, Active_user,
user_dob, user_gender, image_name FROM users
where users.user_id = user_id;

END
//get user info by pid
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_userinfobyPid`(
  IN P_id int
)
BEGIN 
SELECT 
  users.user_id,
   user_name,
   user_email, 
   user_phone, 
   user_role,
 user_dob,
   user_gender
   image_name
FROM
 users 
INNER JOIN mapping_userproject 
   ON users.user_id = mapping_userproject.user_id
   where P_id= mapping_userproject.P_id;
   END