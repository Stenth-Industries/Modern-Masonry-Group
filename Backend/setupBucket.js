/**
 * setupBucket.js
 * Creates the 'product-images' public bucket in Supabase Storage.
 * Run: node setupBucket.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  console.log('\n🪣 Setting up Supabase Storage bucket...\n');

  // Try to create the bucket (will not fail if it already exists)
  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 10485760, // 10MB per image
  });

  if (error) {
    if (error.message?.toLowerCase().includes('already exists')) {
      console.log('✅ Bucket "product-images" already exists — ready to go!\n');
    } else {
      console.error('❌ Failed to create bucket:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Bucket "product-images" created successfully!\n');
  }
}

main().catch((err) => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
