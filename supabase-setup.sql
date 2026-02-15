-- ============================================
-- 세종시 교육감 후보 원성수 홍보 사이트
-- Supabase 초기 설정 SQL
-- Supabase 대시보드 > SQL Editor에서 실행하세요
-- ============================================

-- 1. profiles 테이블 (회원 정보)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 회원가입 시 자동으로 profiles 행 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS (Row Level Security) 활성화 및 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 누구나 프로필 조회 가능
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- 본인 프로필만 수정 가능
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
