import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Call OpenAI API
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is missing' }, { status: 500 });
    }

    const prompt = `
    Rédige un article de blog SEO optimisé en français pour un site de comparaison de forfaits mobiles et internet au Maroc (MonForfait.ma).
    Sujet : ${topic}
    Le format de retour doit être un objet JSON valide avec les clés suivantes:
    - title: Le titre accrocheur
    - slug: Le slug URL (ex: mon-super-article)
    - excerpt: Un résumé court de 2 phrases
    - content: Le contenu de l'article en HTML propre (utilise <h2>, <p>, <ul>, <strong>, etc.)
    - category: La catégorie (ex: Fibre, Mobile, Astuces)
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from OpenAI');
    }

    const result = JSON.parse(data.choices[0].message.content);

    // Insert into Supabase
    const { data: insertedData, error } = await supabase
      .from('blogs')
      .insert([
        {
          title: result.title,
          slug: result.slug,
          excerpt: result.excerpt,
          content: result.content,
          category: category || result.category || 'Astuces',
          cover_image: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80`, // Placeholder image
          author_name: 'Equipe MonForfait',
          author_role: 'Expert Télécom'
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, blog: insertedData[0] });

  } catch (error: any) {
    console.error('Blog generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
