/* Copyright 2016-2020 Gyeonghwan Hong, Eunsoo Park, Sungkyunkwan University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef CPTL_RMAP_CACHE_H
#define CPTL_RMAP_CACHE_H

#include "jrt.h"

extern void init_rmap_cache(void);
extern uint32_t access_and_check_rmap_cache(uint8_t *addr, uint8_t **saddr_out);
extern void update_rmap_cache(uint8_t *saddr, uint32_t sidx);
extern void invalidate_rmap_cache_entry(uint32_t sidx);

#endif /* !defined(CPTL_RMAP_CACHE_H) */