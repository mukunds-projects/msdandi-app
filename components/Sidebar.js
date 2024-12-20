'use client';
import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, BeakerIcon, DocumentTextIcon, CodeBracketIcon, DocumentIcon, DocumentDuplicateIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/dashboards', icon: HomeIcon, current: true },
    { name: 'Research Assistant', href: '#', icon: BeakerIcon, current: false },
    { name: 'Research Reports', href: '#', icon: DocumentTextIcon, current: false },
    { name: 'API Playground', href: '/playground', icon: CodeBracketIcon, current: false },
    { name: 'Invoices', href: '#', icon: DocumentIcon, current: false },
    { name: 'Documentation', href: '#', icon: DocumentDuplicateIcon, current: false, external: true },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} fixed top-0 left-0 h-screen bg-white border-r flex flex-col transition-all duration-300`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-16 bg-white border rounded-full p-1.5 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <Logo collapsed={isCollapsed} />
      </div>

      {/* Account Selector */}
      {!isCollapsed && (
        <div className="px-3 mb-6">
          <button className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100 flex items-center justify-between">
            <span className="font-medium">Personal</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                  ${item.current 
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && (
                  <>
                    <span>{item.name}</span>
                    {item.external && (
                      <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
            M
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <div className="text-sm font-medium">Mukund Sundaram</div>
              </div>
              <button className="p-1 rounded-lg hover:bg-gray-200">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 