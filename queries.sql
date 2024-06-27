/* For details table*/
CREATE TABLE IF NOT EXISTS public.lawyers_detail
(
    lawyer_id integer,
    name character varying(45) COLLATE pg_catalog."default",
    age integer,
    case_type character varying(10) COLLATE pg_catalog."default"
)


/* For users table */

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)