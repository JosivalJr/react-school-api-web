import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
      <footer className="bg-neutral-200 dark:bg-neutral-600 h-24">
        <div
          className="bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 border-solid border-t-2 border-neutral-300">
            <div className="flex justify-center items-center first-letter:container mt-1 mb-5">
            <Link to="https://www.instagram.com/josiva.jr/">
              <FaInstagram size={24} className="mr-2 cursor-pointer"/>
            </Link>

            <Link to="https://www.linkedin.com/in/josivaloliveira/">
              <FaLinkedin size={24} className="mr-2 cursor-pointer"/>
            </Link>

            <Link to="https://github.com/JosivalJr">
              <FaGithub size={24} className="mr-2 cursor-pointer"/>
            </Link>
          </div>

          <div>© 2023 Copyright Josival Oliveira</div>
        </div>
      </footer>
    )
}

export default Footer;
