'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [userName, setUsername] = useState('');
  const [isSign, setIsSign] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match?.[2] || null;
    };

    const token = getCookie('token');
    if (token) {
      console.log('ชื่อผู้ใช้จาก cookie:', token);
      setUsername(token);
      setIsSign(true);
      router.push('/'); // แนะนำใช้ router.push แทน href
    } else {
      setIsSign(false);
      setUsername('');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const pass = e.target.pass.value;
    console.log('ชื่อ:', name);
    console.log('รหัสผ่าน:', pass);

    // คุณสามารถเชื่อม API หรือ logic เพิ่มตรงนี้
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="ชื่อผู้ใช้" />
        <input type="text" name="pass" placeholder="รหัสผ่าน" />
        <button type="submit">ตกลง</button>
      </form>
    </div>
  );
};

export default Page;
