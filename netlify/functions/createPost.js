const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const postData = JSON.parse(event.body);
        
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                ...postData,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
