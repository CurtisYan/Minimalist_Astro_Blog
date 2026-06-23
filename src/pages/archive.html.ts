import { siteConfig } from '../config/site';
import { redirectResponse } from '../lib/redirect-response';

export function GET() {
  return redirectResponse('/', 'Archive', siteConfig.archiveTitle);
}
