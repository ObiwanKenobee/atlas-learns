
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Interventions table
CREATE TABLE public.interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'completed', 'rejected')),
  date_recommended DATE NOT NULL,
  date_implemented DATE,
  confidence_at_issue NUMERIC NOT NULL CHECK (confidence_at_issue BETWEEN 0 AND 100),
  rationale TEXT,
  baseline_conditions JSONB DEFAULT '[]',
  learning_delta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Interventions are publicly readable" ON public.interventions FOR SELECT USING (true);

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON public.interventions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Outcomes table
CREATE TABLE public.outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intervention_id UUID NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  predicted TEXT NOT NULL,
  actual TEXT,
  delta TEXT,
  favorable BOOLEAN,
  measured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Outcomes are publicly readable" ON public.outcomes FOR SELECT USING (true);

CREATE INDEX idx_outcomes_intervention ON public.outcomes(intervention_id);

-- Model versions table
CREATE TABLE public.model_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version_from TEXT NOT NULL,
  version_to TEXT NOT NULL,
  trigger_description TEXT NOT NULL,
  affected_domains TEXT[] DEFAULT '{}',
  parameter_shifts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.model_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Model versions are publicly readable" ON public.model_versions FOR SELECT USING (true);

-- Policy patterns table
CREATE TABLE public.policy_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'emerging')),
  domains TEXT[] DEFAULT '{}',
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.policy_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Policy patterns are publicly readable" ON public.policy_patterns FOR SELECT USING (true);

CREATE TRIGGER update_policy_patterns_updated_at BEFORE UPDATE ON public.policy_patterns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
