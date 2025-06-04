import React from 'react'
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
    return (
        <>
            <header>
                <nav className='navbar flex items-center justify-between p-2'>
                    <main className='logo'>
                        <h1 className='text-2xl font-[600]'>Potato trails</h1>
                    </main>
                    <section className='links'>
                        <ul className='flex items-center justify-center gap-10'>
                            <li className='font-[400] text-sm hover:text-blue-500 transition-colors duration-300'>
                                <a href="/">Home</a>
                            </li>
                            <li className='font-[400] text-sm hover:text-blue-500 transition-colors duration-300'>
                                <a href="/about">Blogs</a>
                            </li>
                            <li className='font-[400] text-sm hover:text-blue-500 transition-colors duration-300'>
                                <a href="/contact">Photos</a>
                            </li>
                            <li className='font-[400] text-sm hover:text-blue-500 transition-colors duration-300'>
                                <a href="/contact">Contact</a>
                            </li>
                        </ul>
                    </section>

                    <section className='search flex items-center gap-4'>
                        <div className="flex items-center bg-gray-200 rounded-full px-4 py-1 w-[300px] border border-gray-300">
                            <FontAwesomeIcon icon={faSearch} className="text-sm text-gray-700" />
                            <input
                                type="text"
                                aria-label="Search blog posts"
                                placeholder="Search..."
                                className="ml-3 bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
                            />
                        </div>
                    </section>
                </nav>
            </header>
        </>
    )
}

export default Navbar
