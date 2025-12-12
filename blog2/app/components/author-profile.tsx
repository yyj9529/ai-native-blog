import Image from 'next/image'
import type { Author } from 'app/types/author'

export const AuthorProfile = ({ author }: { author: Author }) => {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-8">
      <div className="flex items-start gap-4">
        {/* 아바타 이미지 */}
        <Image
          src={author.avatar}
          alt={author.name}
          width={64}
          height={64}
          className="rounded-full"
        />

        {/* 작가 정보 */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Written by {author.name}</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {author.bio}
          </p>

          {/* 소셜 링크 */}
          {author.social && (
            <div className="flex gap-4 mt-3">
              {author.social.github && (
                <a
                  href={author.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  GitHub
                </a>
              )}
              {author.social.twitter && (
                <a
                  href={author.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Twitter
                </a>
              )}
              {author.social.linkedin && (
                <a
                  href={author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
