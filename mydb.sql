PGDMP  1                    |            partai_perubahan    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16416    partai_perubahan    DATABASE     �   CREATE DATABASE partai_perubahan WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
     DROP DATABASE partai_perubahan;
                postgres    false            �            1259    16417    anggota    TABLE     a  CREATE TABLE public.anggota (
    nik character(16) NOT NULL,
    email character varying(255),
    nomor_hp character varying(15),
    alamat text,
    kabupaten character varying(100) NOT NULL,
    provinsi character varying(100) NOT NULL,
    nama character varying(100),
    kecamatan character varying(100),
    kelurahan character varying(100)
);
    DROP TABLE public.anggota;
       public         heap    postgres    false            �          0    16417    anggota 
   TABLE DATA           p   COPY public.anggota (nik, email, nomor_hp, alamat, kabupaten, provinsi, nama, kecamatan, kelurahan) FROM stdin;
    public          postgres    false    215   �       P           2606    16423    anggota anggota_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.anggota
    ADD CONSTRAINT anggota_pkey PRIMARY KEY (nik);
 >   ALTER TABLE ONLY public.anggota DROP CONSTRAINT anggota_pkey;
       public            postgres    false    215            �   I  x�e�?o�0���SxldC��5Q��*JZu��B-pc3��� ���,����+�,�J���LJ�h���OMcú�H�*�7I�兤҆%��,\�8�s?���#�b�^�q�\:��O�ʢ3��A��)�<g^F_�5z�93����6i�m6l��iF}���%s�y�N�"D�zDG���R�o�΋<K61y=����;-�<ܚ���n�Y[p��yx���Ǻ������o������!Hc%e)�Ѻщ�k���l[8�;f�6�d2��� .�M��W8�b7�1�`M������-N�OC[�L<�˿-M�|�A|�V��     