import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Breadcrumbs() {
  const { pathname } = useLocation();
  const { isDarkMode } = useTheme();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <nav className="bg-gray-100 py-2 px-4 dark:bg-gray-800" aria-label="Breadcrumb">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <Link to="/" className="hover:text-red-500 dark:hover:text-red-400">Home</Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li key={name} className="flex items-center">
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="font-bold text-gray-900 dark:text-gray-100">{name}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-red-500 dark:hover:text-red-400">{name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumbs;