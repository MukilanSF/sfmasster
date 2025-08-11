import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avojpmtsdthqcmuooexy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2b2pwbXRzZHRocWNtdW9vZXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4OTU5MjAsImV4cCI6MjA3MDQ3MTkyMH0.UFF6oWZ18RnYbMErL0EODSAyYhDsvVqJ8Fx_Oo3bwu0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch Apex challenges from Supabase
export async function fetchApexChallenges() {
	const { data, error } = await supabase
		.from('apexchallenges')
		.select('*');
	if (error) {
		console.error('Error fetching Apex challenges:', error);
		return [];
	}
	return (data || []).map(ch => ({
		id: ch.id,
		level: ch.difficulty,
		title: ch.title,
		description: ch.description,
		hints: Array.isArray(ch.hints) ? ch.hints : (typeof ch.hints === 'string' ? ch.hints.split('\n') : []),
		starterCode: ch.starter_code,
		solution: ch.solution,
		testCode: ch.test_code
	}));
}

// Fetch LWC challenges from Supabase
export async function fetchLwcChallenges() {
	const { data, error } = await supabase
		.from('lwcchallenges')
		.select('*');
	if (error) {
		console.error('Error fetching LWC challenges:', error);
		return [];
	}
	return (data || []).map(ch => ({
		id: ch.id,
		level: ch.difficulty,
		title: ch.title,
		description: ch.description,
		hints: Array.isArray(ch.hints) ? ch.hints : (typeof ch.hints === 'string' ? ch.hints.split('\n') : []),
		starterCode: ch.starter_code,
		solution: ch.solution,
		testCode: ch.test_code
	}));
}
