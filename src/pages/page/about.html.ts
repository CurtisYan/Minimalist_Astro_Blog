import { redirectResponse } from '../../lib/redirect-response';

export function GET() {
  return redirectResponse('/about/', 'About', 'about');
}
